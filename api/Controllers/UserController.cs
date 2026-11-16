using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Data;
using TodoApi.Models;
using TodoApi.Models.DTOs;

namespace TodoApi.Controllers
{
    [Route("api/users")]
    [ApiController]
    [EnableCors("AllowAll")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ApplicationDBContext _context;

        public UserController(UserManager<User> userManager, ApplicationDBContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var user = await _userManager.FindByNameAsync(User.Identity!.Name!);
            if (user == null)
            {
                return NotFound();
            }
            // Return a DTO, never the Identity entity itself: it contains the password hash and security stamp.
            return Ok(new UserDTO { UserName = user.UserName!, Email = user.Email! });
        }
    }
}
