using System;

namespace TodoApi.Models.DTOs;

public class UpdateTodoDTO
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public bool? IsComplete { get; set; }
}
