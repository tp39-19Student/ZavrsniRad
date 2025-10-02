
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Typefast.Server.Data;
using Typefast.Server.Data.DTOs;
using Typefast.Server.Middleware;
using Typefast.Server.Models;
using Typefast.Server.Services;

namespace Typefast.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly PasswordHasher<Person> _hasher;
        private readonly UserService _userService;
        public UserController(PasswordHasher<Person> hasher, UserService userService)
        {
            _hasher = hasher;
            _userService = userService;
        }

        public class LoginRequest
        {
            public required string Username { get; set; }
            public required string Password { get; set; }
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(LoginRequest req)
        {
            if (await _userService.GetByUsername(req.Username) != null)
            {
                return StatusCode(StatusCodes.Status409Conflict, "The provided username already exists");
            }

            var user = new Person { Username = req.Username };
            user.Password = _hasher.HashPassword(user, req.Password);

            await _userService.Add(user);

            return Created();
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<Person>> Login(LoginRequest req)
        {
            var user = await _userService.GetByUsername(req.Username);
            if (user == null || user.Password == null) return StatusCode(StatusCodes.Status404NotFound, "Incorrect login credentials");

            var result = _hasher.VerifyHashedPassword(user, user.Password, req.Password);
            if (result != PasswordVerificationResult.Success) return StatusCode(StatusCodes.Status404NotFound, "Incorrect login credentials");

            var claims = new List<Claim>
            {
                new Claim("Id", user.IdPer.ToString()),
                new Claim("Username", user.Username!)
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            return user;
        }

        [AllowAnonymous]
        [HttpGet("get")]
        public ActionResult<Person> GetUser(UserContainer user)
        {
            if (user.User == null) return NoContent();
            return user.User;
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }

        [UserOnly]
        [HttpGet("testUser")]
        public IActionResult UserOnlyTest()
        {
            return Ok();
        }

        [AdminOnly]
        [HttpGet("testAdmin")]
        public IActionResult AdminOnlyTest()
        {
            return Ok();
        }

        [HttpPost("follow")]
        public async Task<ActionResult<Person>> SetFollow(FollowRequest req)
        {
            return await _userService.SetFollow(req.IdFer, req.IdFed, req.State);
        }
    }
}