

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
        public async Task<ActionResult<GetProfileResponse>> GetProfile(int idPer, UserContainer userContainer)
        {
            Person user;

            if (idPer == 0) user = userContainer.User!;
            else user = await _profileService.GetProfile(idPer);

            int totalPlays = await _profileService.GetTotalPlays(user.IdPer);

            var stats = await _profileService.GetStats(user.IdPer);

            return new GetProfileResponse
            {
                User = user,
                TotalPlays = totalPlays,
                Wpm = stats[0],
                Accuracy = stats[1]
            };
        }

        [HttpGet("trends/{idPer}")]
        public async Task<GetTrendsResponse> GetStats(int idPer, UserContainer userContainer)
        {
            Person user = (idPer != 0) ? await _userService.GetById(idPer) : userContainer.User!;
            if (user.Op == 1) throw new StatusException(StatusCodes.Status400BadRequest, "Admin users don't have stats");

            var stats = await _profileService.GetTrends(user.IdPer);

            return new GetTrendsResponse
            {
                DailyStats = stats[0],
                MonthlyStats = stats[1]
            };
        }

        [AllowAnonymous]
        [HttpGet("leaderboard")]
        public async Task<ActionResult<Ranking[]>> GetGlobalLeaderbaord()
        {
            return await _profileService.GetGlobalLeaderboard();
        }

        [AdminOnly]
        [HttpPost("block")]
        public async Task<ActionResult<Person>> Block(BlockRequest req)
        {
            return await _profileService.Block(req.IdPer, req.blUntil, req.blReason);
        }

        [AdminOnly]
        [HttpPost("unblock/{idPer}")]
        public async Task<ActionResult<Person>> Unblock(int idPer)
        {
            return await _profileService.Unblock(idPer);
        }
    }
}