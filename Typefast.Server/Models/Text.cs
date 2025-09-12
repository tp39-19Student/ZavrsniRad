


using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
    }
}