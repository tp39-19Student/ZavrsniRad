

using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Typefast.Server.Data;
using Typefast.Server.Data.DTOs;
using Typefast.Server.Middleware;
using Typefast.Server.Models;

namespace Typefast.Server.Services
{
    public class ProfileService
    {
        private readonly AppDbContext _db;

        public ProfileService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<Person> GetProfile(int idPer)
        {
            var p = await _db.People.Include(p => p.Followed).FirstOrDefaultAsync(p => p.IdPer == idPer);
            if (p == null) throw new StatusException(StatusCodes.Status404NotFound, "There is no profile with id " + idPer);

            return p;
        }

        public async Task<int> GetTotalPlays(int idPer)
        {
            return await _db.Scores.Where(s => s.IdPer == idPer).CountAsync();
        }

        public async Task<double[]> GetStats(int idPer)
        {
            //double wpm = await _db.Scores.Where(s => s.IdPer == idPer).OrderByDescending(s => s.IdSco).Take(100).AverageAsync(s => s.Wpm);
            //double accuracy = await _db.Scores.Where(s => s.IdPer == idPer).OrderByDescending(s => s.IdSco).Take(100).AverageAsync(s => s.Accuracy);

            //return [wpm, accuracy];

            var scores = await _db.Scores.Where(s => s.IdPer == idPer).OrderByDescending(s => s.IdSco).Take(101).ToListAsync();

            if (scores.Count == 0) return [0, 0];

            double wpm = scores.Average(s => s.Wpm);
            double accuracy = scores.Average(s => s.Accuracy);

            return [wpm, accuracy];
        }

        public async Task<List<Stat>[]> GetTrends(int idPer)
        {
            List<Stat> rawStats = await _db.Database.SqlQuery<Stat>($"""
                SELECT datePlayed, wpm, accuracy
                FROM (
                    SELECT *, ROW_NUMBER() OVER (
                        PARTITION BY datePlayed
                        ORDER BY datePlayed ASC, idSco DESC
                    ) as n
                    FROM
                    (
                        SELECT idSco, datePlayed, AVG(wpm) OVER (
                            ORDER BY datePlayed, idSco
                            ROWS BETWEEN 100 PRECEDING AND CURRENT ROW
                        ) as wpm, AVG(accuracy) OVER (
                            ORDER BY datePlayed, idSco
                            ROWS BETWEEN 100 PRECEDING AND CURRENT ROW
                        ) as accuracy
                        FROM Score S1
                        WHERE idPer = {idPer}
                    ) as AVERAGES
                ) as NUMBERED_AVERAGES
                WHERE n = 1
            """).ToListAsync();

            if (rawStats.Count == 0) return [[], []];

            List<Stat> dailyList = new List<Stat>();
            List<Stat> monthlyList = new List<Stat>();

            DateOnly start = DateOnly.FromDateTime(DateTime.Now.AddDays(-365));

            int cursor = 0;
            while (cursor < rawStats.Count && rawStats[cursor].DatePlayed < start) cursor++;

            start = DateOnly.FromDateTime(DateTime.Now.AddDays(-31));
            Stat previous = rawStats[cursor];
            //monthlyList.Add(previous);

            int currentYear = previous.DatePlayed.Year;
            int currentMonth = previous.DatePlayed.Month;
            int currentDay = Int32.MaxValue;

            while (cursor < rawStats.Count)
            {
                Stat current = rawStats[cursor++];
                if (current.DatePlayed > start)
                {
                    if (current.DatePlayed.DayNumber > currentDay) dailyList.Add(previous);
                    currentDay = current.DatePlayed.DayOfYear;
                }
                if (current.DatePlayed.Month != currentMonth || current.DatePlayed.Year != currentYear)
                {
                    monthlyList.Add(previous);
                    currentMonth = current.DatePlayed.Month;
                    currentYear = current.DatePlayed.Year;
                }


                previous = current;
            }

            monthlyList.Add(previous);
            dailyList.Add(previous);

            return [dailyList, monthlyList];
        }

        public async Task<Ranking[]> GetGlobalLeaderboard()
        {
            return await _db.Database.SqlQuery<Ranking>($"""
                    SELECT P.idPer, username, COALESCE(AVG(wpm), 0) as wpm, COALESCE(AVG(accuracy), 0) as accuracy
                    FROM
                    (
                        SELECT *, ROW_NUMBER() OVER (
                            PARTITION BY idPer
                            ORDER BY idSco DESC
                        ) as n
                        FROM Score
                    ) AS S1 RIGHT OUTER JOIN Person P ON S1.idPer = P.idPer
                    WHERE (n <= 101 OR n IS NULL) AND P.op = 0
                    GROUP BY P.idPer
                    ORDER BY wpm DESC, accuracy ASC
            """).ToArrayAsync();
        }
    }
}