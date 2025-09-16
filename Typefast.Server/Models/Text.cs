


using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Typefast.Server.Models
{
    [Table("Text")]
    public class Text
    {
        [Key]
        public int IdTex { get; set; }
        public string? Content { get; set; }
        public int IdCat { get; set; }
        public bool Approved { get; set; }

        public Category Category { get; set; }

        [JsonIgnore]
        public IEnumerable<Score> Scores { get; set; } = new List<Score>();
    }
}