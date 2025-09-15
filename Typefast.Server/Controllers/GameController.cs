

using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
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

        public GameController(TextService textService, GameService gameService)
        {
            _textService = textService;
            _gameService = gameService;
        }

        public class SubmitScoreRequest
        {
            public required int IdTex { get; set; }
            public required float Time { get; set; }
            public required float Accuracy { get; set; }
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
            await _gameService.AddScore(score);
            return score;
        }

        [AllowAnonymous]
        [HttpGet("leaderboard/{idTex}")]
        public async Task<List<Score>> GetLeaderboard(int idTex)
        {
            return await _gameService.GetLeaderboard(idTex);
        }
    }
}