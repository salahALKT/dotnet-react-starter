namespace TodoApi.Models;

public class TodoItem
{
    public long Id { get; set; }
    public string? Title { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime? CompletedAt { get; set; }
    public bool IsComplete { get; set; }
    public required string UserId { get; set; }
}