

using System.Text.Json;

namespace Typefast.Server.Middleware
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (StatusException ex)
            {
                context.Response.StatusCode = ex.StatusCode;
                await context.Response.WriteAsync(ex.Message);
                return;
            }
        }
    }

    public class StatusException : Exception {
        public int StatusCode { get; set; }

        public StatusException(int statusCode, string message) : base(message)
        {
            StatusCode = statusCode;
        }
    }
}