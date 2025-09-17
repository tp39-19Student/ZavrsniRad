

using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Typefast.Server.Controllers;
using Typefast.Server.Data;
using Typefast.Server.Data.DTOs;
using Typefast.Server.Middleware;
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

        public async Task<Person> GetById(int id)
        {
            Person? user = await _db.People.Include(u => u.Followed).FirstOrDefaultAsync(u => u.IdPer == id);
            if (user == null) throw new StatusException(StatusCodes.Status404NotFound, "There is no user with id: " + id);

            return user;
        }

        public async Task<Person?> GetByUsername(string username)
        {
            return await _db.People.Include(p => p.Followed).FirstOrDefaultAsync(u => u.Username == username);
        }

        public async Task<Boolean> Add(Person user)
        {
            _db.Add(user);
            await _db.SaveChangesAsync();
            return true;
        }
    }
}