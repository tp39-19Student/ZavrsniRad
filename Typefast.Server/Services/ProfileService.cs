

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

        public async Task<List<Stat>[]> GetStats(int idPer)
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
            monthlyList.Add(previous);

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
    }
}