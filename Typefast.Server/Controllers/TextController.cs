


using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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


        [HttpGet("getApproved")]
        public async Task<List<Text>> GetAll()
        {
            var texts = await _textService.GetApproved();
            return texts;
        }

        [HttpGet("categories")]
        public async Task<List<Category>> GetCategories()
        {
            return await _textService.GetCategories();
        }

        public class SubmitTextRequest
        {
            public required string Text { get; set; }
            public required int IdCat { get; set; }
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
            await _textService.changeCategory(idTex, idCat);
            return await _textService.GetById(idTex);
        }
    }
}