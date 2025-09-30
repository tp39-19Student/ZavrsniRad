


using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Typefast.Server.Data;

namespace Typefast.Server.Services
{
    public class DailyService : IHostedService, IDisposable
    {
        private readonly ILogger<DailyService> _logger;
        public IServiceProvider Services { get; }
        private Timer? _timer = null;
        public long NextDailyTimestamp { get; set; } = 0;
        private readonly long IntervalSeconds = 86400; // 24 * 60 * 60 = 86400

        public DailyService(ILogger<DailyService> logger, IServiceProvider services)
        {
            _logger = logger;
            Services = services;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Daily service started...");

            long timeToWait = 0;
            using (var scope = Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var daily = await db.Dailies.FirstOrDefaultAsync();

                if (daily != null)
                {
                    NextDailyTimestamp = DateTimeOffset.FromUnixTimeSeconds(daily.StartTime).AddSeconds(IntervalSeconds).ToUnixTimeSeconds();
                    timeToWait = NextDailyTimestamp - DateTimeOffset.UtcNow.ToUnixTimeSeconds();
                    if (timeToWait < 0) timeToWait = 0;
                }
            }

            _logger.LogInformation("Next daily at: " + ((timeToWait > 0)?NextDailyTimestamp:"NOW"));
            _logger.LogInformation("Seconds until next daily: " + timeToWait);
            _timer = new Timer(DoWork, null, timeToWait * 1000, IntervalSeconds * 1000);
        }

        private async void DoWork(object? state) {
            using (var scope = Services.CreateScope())
            {
                try
                {
                    var gameService = scope.ServiceProvider.GetRequiredService<GameService>();
                    var daily = await gameService.ChangeDaily();
                    NextDailyTimestamp = daily.StartTime + IntervalSeconds;

                    _logger.LogInformation($"Selected new daily: IdDai({daily.IdDai}) IdTex: ({daily.IdTex})");
                    _logger.LogInformation("Next daily at: " + NextDailyTimestamp);
                }
                catch (Exception e)
                {
                    _logger.LogWarning("Daily not selected: {e}", e);
                }
            }
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Daily service stopping...");
            _timer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}