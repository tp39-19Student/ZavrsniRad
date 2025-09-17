

using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Typefast.Server.Data.DTOs;
using Typefast.Server.Middleware;
using Typefast.Server.Models;
using Typefast.Server.Services;

namespace Typefast.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly ProfileService _profileService;

        public ProfileController(UserService userService, ProfileService profileService)
        {
            _userService = userService;
            _profileService = profileService;
        }

        [HttpGet("{idPer}")]
        public async Task<ActionResult<Person>> GetProfile(int idPer, UserContainer userContainer)
        {
            if (idPer == 0) return userContainer.User!;
            return await _profileService.GetProfile(idPer);
        }

        [HttpGet("stats/{idPer}")]
        public async Task<GetStatsResponse> GetStats(int idPer, UserContainer userContainer)
        {
            Person user = (idPer != 0)?await _userService.GetById(idPer):userContainer.User!;
            if (user.Op == 1) throw new StatusException(StatusCodes.Status400BadRequest, "Admin users don't have stats");

            var stats = await _profileService.GetStats(user.IdPer);

            return new GetStatsResponse
            {
                DailyStats = stats[0],
                MonthlyStats = stats[1]
            };
        }
    }
}