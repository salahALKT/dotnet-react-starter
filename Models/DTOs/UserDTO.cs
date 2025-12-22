using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TodoApi.Models.DTOs;

public class UserDTO
{
    // can set json name with[JsonPropertyName("userName")]
    [Required]
    public string UserName { get; set; }= string.Empty;
    
    [Required]
    public string Email { get; set; } = string.Empty;
}
