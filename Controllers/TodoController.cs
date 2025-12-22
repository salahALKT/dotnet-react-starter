using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TodoApi.Constants;
using TodoApi.Data;
using TodoApi.Models;
using TodoApi.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;

namespace TodoApi.Controllers
{
    [Route("api/todos")]
    [ApiController]
    [Authorize]
    [EnableCors("AllowAll")]
    public class TodoController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public TodoController(ApplicationDBContext context)
        {
            _context = context;
        }
        
        [HttpGet]
        //[AllowAnonymous] to make it public
        //[Authorize(Roles = Roles.Admin)] for admin only
        public async Task<IActionResult> GetAllTodosAync()
        {
            var userId = _context.Users.FirstOrDefault(u => u.UserName == User.Identity!.Name)?.Id; // could add userId to the token instead of querying the database everytime
            var todoquery = _context.TodoItems.Where(u => u.UserId == userId);
            var todos = await todoquery.ToListAsync();
            if (todos == null)
            {
                return NotFound();
            }
            return Ok(todos);
        }

        [HttpGet("{id}", Name = "GetTodoByIdAsync")]
        public async Task<IActionResult> GetTodoByIdAsync(long id)
        {
            var todo = await _context.TodoItems.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }
            return Ok(todo);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTodoAsync([FromBody] CreateTodoDTO createTodoDTO)
        {
            var todoItem = new TodoItem
            {
                Title = createTodoDTO.Title,
                Description = createTodoDTO.Description,
                CreatedAt = DateTime.UtcNow,
                IsComplete = false,
                UserId = _context.Users.FirstOrDefault(u => u.UserName == User.Identity!.Name)?.Id!
            };
            await _context.TodoItems.AddAsync(todoItem);
            await _context.SaveChangesAsync();
            return CreatedAtRoute("GetTodoByIdAsync", new { id = todoItem.Id }, todoItem);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodoAsync(long id, [FromBody] UpdateTodoDTO updateTodoDTO)
        {
            var todo = await _context.TodoItems.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }
            var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.UserName == User.Identity!.Name); // could add userId to the token instead of querying the database everytime
            if (todo.UserId != currentUser!.Id) // could do : if (currentUser == null || todo.UserId != currentUser.Id)
            {
                return Forbid();
            }
            todo.Title = updateTodoDTO.Title ?? todo.Title;
            todo.Description = updateTodoDTO.Description ?? todo.Description;
            todo.IsComplete = updateTodoDTO.IsComplete ?? todo.IsComplete;
            if (updateTodoDTO.IsComplete == true)
            {
                todo.CompletedAt = DateTime.UtcNow;
            }
            else
            {
                todo.CompletedAt = null;
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodoAsync(long id)
        {
            var todo = await _context.TodoItems.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }
            var curretUser = await _context.Users.FirstOrDefaultAsync(u => u.UserName == User.Identity!.Name);
            if (todo.UserId != curretUser!.Id) // could do : if (currentUser == null || todo.UserId != currentUser.Id)
            {
                return Forbid();
            }
            _context.TodoItems.Remove(todo);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
