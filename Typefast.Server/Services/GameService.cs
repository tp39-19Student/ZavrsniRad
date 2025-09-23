using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Typefast.Server.Data;
using Typefast.Server.Data.DTOs;
using Typefast.Server.Middleware;
using Typefast.Server.Models;

namespace Typefast.Server.Services
{
    public class GameService
    {
        private readonly AppDbContext _db;
        private readonly TextService _textService;

        public GameService(AppDbContext db, TextService textService)
        {
            _db = db;
            _textService = textService;
        }


        public async Task<Score> SubmitScore(SubmitScoreRequest req, Person user)
        {
            if (user == null) throw new StatusException(StatusCodes.Status400BadRequest, "Cannot submit guest scores");

            Text text = await _textService.GetById(req.IdTex);
            if (text.Approved == false) throw new StatusException(StatusCodes.Status400BadRequest, "Text is not approved, cannot submit score");

            Score score = new Score();
            score.IdPer = user.IdPer;
            score.IdTex = req.IdTex;
            score.Time = req.Time;
            score.Accuracy = req.Accuracy;
            score.DatePlayed = DateOnly.FromDateTime(DateTime.Now);
            score.Wpm = (text.Content.Length / 5.0) * (60.0 / req.Time);

            _db.Scores.Add(score);
            await _db.SaveChangesAsync();

            return score;
        }

        public async Task<Score> SubmitDailyScore(SubmitScoreRequest req, Person user)
        {
            Score score = await SubmitScore(req, user);
            var daily = await _db.Dailies.FirstOrDefaultAsync();
            if (daily != null && daily.IdTex == score.IdTex)
            {
                _db.DailyScores.Add(new DailyScore
                {
                    IdSco = score.IdSco
                });   
            }
            await _db.SaveChangesAsync();

            return score;
        }

        public async Task DeleteScore(int idSco)
        {
            var score = _db.Scores.FirstOrDefault(s => s.IdSco == idSco);
            if (score == null) throw new StatusException(StatusCodes.Status404NotFound, "There is no score with id " + idSco);

            var dailyScore = await _db.DailyScores.Where(s => s.IdSco == score.IdSco).FirstOrDefaultAsync();
            if (dailyScore != null) _db.DailyScores.Remove(dailyScore);

            _db.Scores.Remove(score);
            await _db.SaveChangesAsync();
        }

        public async Task<Score[]> GetScores(Person user)
        {
            return (await _db.People.Include(p => p.Scores).FirstAsync(u => u.IdPer == user.IdPer)).Scores.ToArray();
        }

        public async Task<List<Score>> GetLeaderboard(int idTex)
        {
            return await _db.Scores.FromSql($"""
                SELECT S1.*
                FROM Score S1
                JOIN (
                    SELECT idPer, min(time) as mt
                    FROM Score S2
                    WHERE idTex = {idTex}
                    GROUP BY idPer
                ) T1 ON S1.idPer = T1.idPer AND S1.time = T1.mt
                JOIN (
                    SELECT idPer, time, MAX(accuracy) as ma
                    FROM Score S3
                    WHERE idTex = {idTex}
                    GROUP BY idPer, time
                ) T2 ON S1.idPEr = T2.idPer AND S1.time = T2.time AND S1.accuracy = T2.ma
                WHERE idTex = {idTex}
            """)
            .Include(s => s.User)
            .ToListAsync();
        }

        public async Task<List<Score>> GetDailyLeaderboard()
        {
            Text dailyText = await _textService.GetDailyText();

            int idTex = dailyText.IdTex;

            return await _db.Scores.FromSql($"""
                WITH DS AS (
                    SELECT S.*
                    FROM DailyScore D
                    JOIN Score S ON S.idSco = D.idSco
                )
                SELECT S1.*
                FROM DS S1
                JOIN (
                    SELECT idPer, min(time) as mt
                    FROM DS S2
                    WHERE idTex = {idTex}
                    GROUP BY idPer
                ) T1 ON S1.idPer = T1.idPer AND S1.time = T1.mt
                JOIN (
                    SELECT idPer, time, MAX(accuracy) as ma
                    FROM DS S3
                    WHERE idTex = {idTex}
                    GROUP BY idPer, time
                ) T2 ON S1.idPEr = T2.idPer AND S1.time = T2.time AND S1.accuracy = T2.ma
                WHERE idTex = {idTex}
            """)
            .Include(s => s.User)
            .OrderBy(s => s.Time)
            .ToListAsync();
        }

        public async Task GiveDailyRewards()
        {
            List<Score> leaderboard = await GetDailyLeaderboard();

            int count = leaderboard.Count;

            int gold = (int)Math.Ceiling(count / 10.0);
            int silver = (int)Math.Ceiling(count / 10.0);
            int bronze = (int)Math.Ceiling(count / 10.0);

            int cursor = 0;

            while (cursor < count && gold > 0)
            {
                int idPer = leaderboard[cursor].IdPer;
                var user = await _db.People.Where(p => p.IdPer == idPer).FirstAsync();
                user.Gold = user.Gold + 1;
                gold--;
                cursor++;
            }

            while (cursor < count && silver > 0)
            {
                int idPer = leaderboard[cursor].IdPer;
                var user = await _db.People.Where(p => p.IdPer == idPer).FirstAsync();
                user.Silver = user.Silver + 1;
                silver--;
                cursor++;
            }

            while (cursor < count && bronze > 0)
            {
                int idPer = leaderboard[cursor].IdPer;
                var user = await _db.People.Where(p => p.IdPer == idPer).FirstAsync();
                user.Bronze = user.Bronze + 1;
                bronze--;
                cursor++;
            }

            await _db.SaveChangesAsync();
        }

        public async Task ChangeDaily()
        {
            Daily? existing = await _db.Dailies.FirstOrDefaultAsync();
            if (existing != null)
            {
                await GiveDailyRewards();
            }

            await _db.DailyScores.ExecuteDeleteAsync();
            await _db.Dailies.ExecuteDeleteAsync();

            Text next = await _textService.GetRandom();
            _db.Dailies.Add(new Daily
            {
                IdTex = next.IdTex,
                StartTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
            });

            await _db.SaveChangesAsync();
        }
    }
}