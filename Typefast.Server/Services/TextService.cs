


using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Typefast.Server.Data;
using Typefast.Server.Middleware;
using Typefast.Server.Models;

namespace Typefast.Server.Services
{
    public class TextService
    {
        private readonly AppDbContext _db;
        private readonly Random rand = new Random();

        public TextService(AppDbContext db)
        {
            _db = db;
        }


        public async Task<List<Text>> GetApproved()
        {
            return await _db.Texts
                .Where(text => text.Approved == true)
                .Include(text => text.Category)
                .ToListAsync();
        }

        public async Task<List<Text>> GetPending()
        {
            return await _db.Texts
                .Where(text => text.Approved == false)
                .Include(text => text.Category)
                .ToListAsync();
        }

        public async Task<Text> Approve(int idTex)
        {
            Text text = await GetById(idTex);
            text.Approved = true;
            await _db.SaveChangesAsync();
            return text;
        }

        public async Task<Text> GetById(int id)
        {
            Text? res = await _db.Texts
                .Include(text => text.Category)
                .FirstOrDefaultAsync(t => t.IdTex == id);

            if (res == null) throw new StatusException(StatusCodes.Status404NotFound, "There is no text with id " + id);

            return res;
        }

        public async Task<List<Category>> GetCategories()
        {
            return await _db.Categories.ToListAsync();
        }

        public async Task<Category> GetCategoryById(int idCat)
        {
            var cat = await _db.Categories.FirstOrDefaultAsync(c => c.IdCat == idCat);
            if (cat == null) throw new StatusException(StatusCodes.Status404NotFound, "There is no category with id " + idCat);

            return cat;
        }

        public async Task<bool> Add(Text text)
        {
            _db.Texts.Add(text);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Delete(int idTex)
        {
            Text text = await GetById(idTex);
            Daily? daily = await _db.Dailies.FirstOrDefaultAsync();

            if (daily != null && daily.IdTex == text.IdTex) throw new StatusException(StatusCodes.Status400BadRequest, "Cannot delete daily text");

            _db.Scores.RemoveRange(_db.Scores.Where(s => s.IdTex == idTex));
            _db.Texts.Remove(text);

            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<Text> ChangeCategory(int idTex, int idCat)
        {
            Text text = await GetById(idTex);
            Category cat = await GetCategoryById(idCat);

            text.IdCat = idCat;
            await _db.SaveChangesAsync();
            return text;
        }

        public async Task<Text> GetRandom()
        {
            int count = await _db.Texts.Where(t => t.Approved == true).CountAsync();
            if (count == 0) throw new StatusException(StatusCodes.Status404NotFound, "There are no approved texts in the database");
            int index = (int)Math.Floor(rand.NextDouble() * count);

            return (await _db.Texts.Where(t => t.Approved == true).Skip(index).FirstOrDefaultAsync())!;
        }

        public async Task<Text> GetDailyText()
        {
            var daily = await _db.Dailies.FirstOrDefaultAsync();
            if (daily == null) throw new StatusException(StatusCodes.Status500InternalServerError, "Daily challenge is not set");

            return await _db.Texts.Where(t => t.IdTex == daily.IdTex).Include(t => t.Category).FirstAsync();
        }

        public async Task<Score[]> GetScores(int idTex)
        {
            var text = await _db.Texts.Include(t => t.Scores).ThenInclude(s => s.User).FirstOrDefaultAsync(t => t.IdTex == idTex);
            if (text == null) throw new StatusException(StatusCodes.Status404NotFound, "There is no text with id " + idTex);

            return text.Scores.ToArray();
        }

        public async Task<Score[]> GetDailyScores()
        {
            Text dailyText = await GetDailyText();
            return await _db.Scores.FromSql($"SELECT S.* FROM Score S JOIN DailyScore DS ON S.idSco = DS.idSco WHERE S.idTex = {dailyText.IdTex}").Include(s => s.User).ToArrayAsync();
        }
    }
}