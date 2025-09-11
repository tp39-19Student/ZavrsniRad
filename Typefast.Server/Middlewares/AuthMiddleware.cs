

using Microsoft.AspNetCore.Authorization;
using Typefast.Server.Data;
using Typefast.Server.Services;

namespace Typefast.Server.Middleware
{

    public class AdminOnlyAttribute : Attribute { };
    public class UserOnlyAttribute : Attribute { };

    public class AuthMiddleware
    {
        private readonly RequestDelegate _next;
        public AuthMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, UserContainer userContainer)
        {
            bool anon = context.GetEndpoint()?.Metadata.GetMetadata<AllowAnonymousAttribute>() != null;
            bool adminOnly = context.GetEndpoint()?.Metadata.GetMetadata<AdminOnlyAttribute>() != null;
            bool userOnly = context.GetEndpoint()?.Metadata.GetMetadata<UserOnlyAttribute>() != null;

            var id = context.User.FindFirst("Id")?.Value;
            if (id != null)
            {
                var _db = context.RequestServices.GetRequiredService<AppDbContext>();
                var user = _db.People.FirstOrDefault(u => u.IdPer == int.Parse(id));
                if (user != null) userContainer.User = user;
            }

            if (!anon)
            {
                if (userContainer.User == null) throw new StatusException(StatusCodes.Status401Unauthorized, "Endpoint requires authentication");

                if (adminOnly && userContainer.User.Op != 1) throw new StatusException(StatusCodes.Status401Unauthorized, "Endpoint is admin only");
                if (userOnly && userContainer.User.Op != 0) throw new StatusException(StatusCodes.Status401Unauthorized, "Endpoint is user only");
            }  

            

            await _next(context);
        }
    }
}