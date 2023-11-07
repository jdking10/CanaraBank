using System.ComponentModel.DataAnnotations;

namespace CanaraBank.Models
{
    public class LoginModel
    {
        [Required]
        [MaxLength(16)]
        [MinLength(6)]
        [Display(Name = "ID")]
        public string UserId { get; set; } = string.Empty;

        [Required]
        [MaxLength(16)]
        [MinLength(5)]
        [Display(Name = "Password")]
        public string Password { get; set; } = string.Empty;
    }
}