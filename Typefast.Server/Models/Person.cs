

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Typefast.Server.Models
{
    [Table("Person")]
    public class Person
    {
        [Key]
        public int IdPer { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public int Op { get; set; }
        public int Gold { get; set; }
        public int Silver { get; set; }
        public int Bronze { get; set; }

        public string? BlReason { get; set; }
        public int BlUntil { get; set; }
    }
}