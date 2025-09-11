
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Typefast.Server.Data;
using Typefast.Server.Models;

namespace Typefast.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly PasswordHasher<Person> _hasher;
        private readonly AppDbContext _db;
        public UserController(PasswordHasher<Person> hasher, AppDbContext db)
        {
            _hasher = hasher;
            _db = db;
        }

        public class LoginRequest
        {
            public string Username { get; set; }
            public string Password { get; set; }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(LoginRequest req)
        {
            if (await _db.People.FirstOrDefaultAsync(u => u.Username == req.Username) != null)
            {
                return StatusCode(StatusCodes.Status409Conflict, "The provided username already exists");
            }

            var user = new Person { Username = req.Username };
            user.Password = _hasher.HashPassword(user, req.Password);

            _db.People.Add(user);
            _db.SaveChanges();

            return Created();
        }

        [HttpPost("login")]
        public async Task<ActionResult<Person>> Login(LoginRequest req)
        {
            var user = _db.People.FirstOrDefault(u => u.Username == req.Username);
            if (user == null) return StatusCode(StatusCodes.Status404NotFound, "Incorrect login credentials");

            var result = _hasher.VerifyHashedPassword(user, user.Password, req.Password);
            if (result != PasswordVerificationResult.Success) return StatusCode(StatusCodes.Status404NotFound, "Incorrect login credentials");

            var claims = new List<Claim>
            {
                new Claim("Id", user.IdPer.ToString())
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            return user;
        }

        [HttpGet("get")]
        public ActionResult<Person> GetUser()
        {
            var id = User.FindFirst("Id")?.Value;
            if (id == null) return NoContent();

            var user = _db.People.FirstOrDefault(u => u.IdPer == int.Parse(id));
            if (user == null) return NoContent();

            return user;
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }
    }
}