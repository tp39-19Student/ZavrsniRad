

using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Typefast.Server.Data;
using Typefast.Server.Models;

namespace Typefast.Server.Services
{
    public class UserService
    {
        private readonly AppDbContext _db;

        public UserService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<Person?> GetById(int id)
        {
            return await _db.People.FirstOrDefaultAsync(u => u.IdPer == id);
        }

        public async Task<Person?> GetByUsername(string username)
        {
            return await _db.People.FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<Boolean> Add(Person user)
        {
            _db.Add(user);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}