

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Typefast.Server.Models
{
    [Table("Category")]
    public class Category
    {
        [Key]
        public int IdCat { get; set; }
        public string? Name { get; set; }

        [JsonIgnore]
        public ICollection<Text> Texts { get; set; } = new List<Text>();
    }
}