


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
            .HasMany(category => category.Texts)
            .WithOne(text => text.Category)
            .HasForeignKey(text => text.IdCat)
            .HasPrincipalKey(category => category.IdCat);

            modelBuilder.Entity<Person>()
            .HasMany(person => person.Scores)
            .WithOne(score => score.User)
            .HasForeignKey(score => score.IdPer)
            .HasPrincipalKey(person => person.IdPer);

            modelBuilder.Entity<Text>()
            .HasMany(text => text.Scores)
            .WithOne(score => score.Text)
            .HasForeignKey(score => score.IdTex)
            .HasPrincipalKey(text => text.IdTex);

            modelBuilder.Entity<Person>()
            .HasMany(e => e.Followers)
            .WithMany(e => e.Followed)
            .UsingEntity<Follows>(
                r => r.HasOne<Person>().WithMany().HasForeignKey(f => f.IdFer),
                d => d.HasOne<Person>().WithMany().HasForeignKey(f => f.IdFed));
        }
    }
}