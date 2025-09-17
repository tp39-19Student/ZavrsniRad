

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
            Text text = await _textService.GetById(req.IdTex);
            if (text.Approved == false) throw new StatusException(StatusCodes.Status400BadRequest, "Text is not approved, cannot submit score");

            Score score = new Score();
            score.IdPer = userContainer.User!.IdPer;
            score.IdTex = req.IdTex;
            score.Time = req.Time;
            score.Accuracy = req.Accuracy;
            score.DatePlayed = DateOnly.FromDateTime(DateTime.Now);
            score.Wpm = (text.Content.Length / 5.0) * (60.0 / req.Time);
            await _gameService.AddScore(score);
            return score;
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
        public async Task<List<Score>> GetLeaderboard(int idTex)
        {
            return await _gameService.GetLeaderboard(idTex);
        }
    }
}