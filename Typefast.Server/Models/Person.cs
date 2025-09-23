

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Typefast.Server.Models
{
    [Table("Person")]
    public class Person
    {
        [Key]
        public int IdPer { get; set; }
        public string? Username { get; set; }
        [JsonIgnore]
        public string? Password { get; set; }
        public int Op { get; set; }
        public int Gold { get; set; }
        public int Silver { get; set; }
        public int Bronze { get; set; }

        public string? BlReason { get; set; }
        public long BlUntil { get; set; }

        [JsonIgnore]
        public ICollection<Score> Scores { get; set; } = new List<Score>();

        [JsonIgnore]
        public ICollection<Person> Followers { get; set; } = new List<Person>();

        public ICollection<Person> Followed { get; set; } = new List<Person>();

    }
}