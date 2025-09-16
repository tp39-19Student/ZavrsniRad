using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Typefast.Server.Data;
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


        public async Task<Score> AddScore(Score score)
        {
            _db.Scores.Add(score);
            await _db.SaveChangesAsync();

            return score;
        }

        public async Task DeleteScore(int idSco)
        {
            var score = _db.Scores.FirstOrDefault(s => s.IdSco == idSco);
            if (score == null) throw new StatusException(StatusCodes.Status404NotFound, "There is no score with id " + idSco);

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

        
    }
}