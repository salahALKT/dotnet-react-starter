using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using NuGet.Common;
using TodoApi.Models;

namespace TodoApi.Data;

public class ApplicationDBContext : IdentityDbContext<User>
{
    public ApplicationDBContext(DbContextOptions<ApplicationDBContext> dbContextOptions) : base(dbContextOptions)
    {
    }

    public DbSet<TokenInfo> TokenInfos { get; set; }
    public DbSet<TodoItem> TodoItems { get; set; } = null!;

}
