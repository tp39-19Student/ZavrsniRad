

using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
using Typefast.Server.Data.DTOs;
using Typefast.Server.Middleware;
using Typefast.Server.Models;
using Typefast.Server.Services;

namespace Typefast.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private readonly TextService _textService;
        private readonly GameService _gameService;
        private readonly UserService _userService;

        public GameController(TextService textService, GameService gameService, UserService userService)
        {
            _textService = textService;
            _gameService = gameService;
            _userService = userService;
        }

        [UserOnly]
        [HttpPost("submitScore")]
        public async Task<ActionResult<Score>> SubmitScore(SubmitScoreRequest req, UserContainer userContainer)
        {
            return await _gameService.SubmitScore(req, userContainer.User!);
        }

        [UserOnly]
        [HttpPost("submitDailyScore")]
        public async Task<ActionResult<Score>> SubmitDailyScore(SubmitScoreRequest req, UserContainer userContainer)
        {
            return await _gameService.SubmitDailyScore(req, userContainer.User!);
        }

        [AdminOnly]
        [HttpDelete("deleteScore/{idSco}")]
        public async Task<IActionResult> DeleteScore(int idSco)
        {
            await _gameService.DeleteScore(idSco);
            return NoContent();
        }

        [AllowAnonymous]
        [HttpGet("leaderboard/{idTex}")]
        public async Task<ActionResult<GetLeaderboardResponse>> GetLeaderboard(int idTex)
        {
            var scores = await _gameService.GetLeaderboard(idTex);
            return new GetLeaderboardResponse
            {
                Scores = scores,
                IdTex = idTex
            };
        }

        [AllowAnonymous]
        [HttpGet("leaderboard/daily")]
        public async Task<ActionResult<List<Score>>> GetDailyLeaderboard()
        {
            return await _gameService.GetDailyLeaderboard();
        }

        [AllowAnonymous]
        [HttpGet("nextDailyTime")]
        public ActionResult<long> GetNextDailyTime(DailyService dailyService)
        {
            return dailyService.NextDailyTimestamp;
        }


        //For testing
        [AllowAnonymous]
        [HttpGet("changeDaily")]
        public async Task ChangeDaily()
        {
            await _gameService.ChangeDaily();
        }
    }
}