

using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Typefast.Server.Models
{
    [Table("Follows")]
    [PrimaryKey(nameof(IdFer), nameof(IdFed))]
    public class Follows
    {
        public int IdFer { get; set; }
        public int IdFed { get; set; }
    }
}