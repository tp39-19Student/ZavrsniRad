


using Microsoft.EntityFrameworkCore;
using Typefast.Server.Models;

namespace Typefast.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Text> Texts { get; set; }
        public DbSet<Daily> Dailies { get; set; }
        public DbSet<Person> People { get; set; }
        public DbSet<Score> Scores { get; set; }
        public DbSet<DailyScore> DailyScores { get; set; }
        public DbSet<Follows> Follows { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Category>()
            .HasMany(c => c.Texts)
            .WithOne(t => t.Category)
            .HasForeignKey(t => t.IdCat)
            .HasPrincipalKey(c => c.IdCat);


        }
    }
}