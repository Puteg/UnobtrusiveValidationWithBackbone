using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Dynamic;
using System.Linq;
using System.Net.Mime;
using System.Web;
using System.Web.Mvc;

namespace ValidationForm.Models
{

    public class Data
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "Желание")]
        [Range(1, Int32.MaxValue, ErrorMessage = "Обязательное поле")]
        public int WhishId { get; set; }

        [StringLength(25, MinimumLength = 5)]
        [Required]
        [Display(Name = "ФИО", Prompt = "Введите ФИО")]
        public string FIO { get; set; }

        [Required]
        [Range(10000000000, 99999999999, ErrorMessage = "Не корректный номер, необходимо 11 цифр")]
        [Display(Name = "Телефон", Prompt = "Введите номер телефона")]
        public Int64 Phone { get; set; }

        [EmailAddress]
        [Display(Name = "Email", Prompt = "Введите коректный email")]
        [Required]
        public string Email { get; set; }

        public static Data Create()
        {
            return new Data
                {
                    FIO = null,
                    Email = null,
                    Phone = 0,
                    WhishId = 0,
                };
        }
    }

    public class VMData
    {
        public Data Model { get; set; }
        public SelectListItem[] ListState
        {
            get
            {
                return new []
                           {
                               new SelectListItem { Value = "0", Text = "" }, 
                               new SelectListItem { Value = "1", Text = "Машина" }, 
                               new SelectListItem { Value = "2", Text = "Квартира" }, 
                               new SelectListItem { Value = "3", Text = "Красиивая жена" },
                               new SelectListItem { Value = "4", Text = "Куча денег" }
                           };
            }
        }

        public static VMData Create()
        {
            return new VMData { Model = Data.Create() };
        }
    }




}