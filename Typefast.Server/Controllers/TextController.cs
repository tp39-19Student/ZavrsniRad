


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
    public class TextController : ControllerBase
    {
        private readonly TextService _textService;

        public TextController(TextService textService)
        {
            _textService = textService;
        }

        [AllowAnonymous]
        [HttpGet]
        [HttpGet("{idTex}")]
        public async Task<ActionResult<Text>> Get(int idTex)
        {
            if (idTex == 0) return await _textService.GetRandom();
            return await _textService.GetById(idTex);
        }

        [HttpGet("getApproved")]
        public async Task<List<Text>> GetApproved()
        {
            var texts = await _textService.GetApproved();
            return texts;
        }

        [HttpPut("approve/{idTex}")]
        public async Task<ActionResult<Text>> Approve(int idTex)
        {
            return await _textService.Approve(idTex);
        }

        [AdminOnly]
        [HttpGet("getPending")]
        public async Task<List<Text>> GetPending()
        {
            return await _textService.GetPending();
        }

        [HttpGet("categories")]
        public async Task<List<Category>> GetCategories()
        {
            return await _textService.GetCategories();
        }



        [HttpPost("submit")]
        public async Task<IActionResult> SubmitText(SubmitTextRequest req, UserContainer userContainer)
        {
            await _textService.GetCategoryById(req.IdCat);
            Text text = new Text();

            text.Content = req.Text;
            text.IdCat = req.IdCat;
            text.Approved = (userContainer.User!.Op == 1) ? true : false;

            await _textService.Add(text);

            return Created();
        }

        [AdminOnly]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteText(int id, UserContainer userContainer)
        {
            await _textService.Delete(id);
            return NoContent();
        }

        [AdminOnly]
        [HttpPut("changeCategory/{idTex}/{idCat}")]
        public async Task<ActionResult<Text>> ChangeTextCategory(int idTex, int idCat)
        {
            return await _textService.ChangeCategory(idTex, idCat);
        }

        [AllowAnonymous]
        [HttpGet("{idTex}/scores")]
        public async Task<Score[]> GetScores(int idTex)
        {
            return await _textService.GetScores(idTex);
        }
    }
}