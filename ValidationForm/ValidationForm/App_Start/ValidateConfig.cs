using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace ValidationForm
{
    /*
    *   Правила для backbone.validation
    *   http://thedersen.com/projects/backbone-validation/#built-in-validators/required (1)

    *   атрибуты DataAnotation для валидации
    *   http://andrey.moveax.ru/mvc3-in-depth/data-validation/01-validation-basics/ (2)

    
     *   для  примера правило для атрибута    [Range(1,2)]
     *   в js получим 
     *  
     *   OrderId :[{ 
     *       "range":[1,2],
     *       "msg":"Поле Отдел должно иметь значение между 1 и 2."
     *   }]
    */

    public class ValidateConfig
    {
        public static void RegisterRule(Dictionary<string, Func<ModelClientValidationRule, List<object>>> rules)
        {
            rules.Add("range", // сторона сервера -  должно совпадать с типом   ModelClientValidationRule.ValidationType 
                r => new List<object>(){
                    new { 
                        range = new object[] { r.ValidationParameters["min"], r.ValidationParameters["max"] },// имя правила и параметр на стороне клиента  
                        msg= r.ErrorMessage // сообщение об ошибке на клиенте. Смотри (1)
                    }
                });
            rules.Add("remote", // сторона сервера -  должно совпадать с типом   ModelClientValidationRule.ValidationType 
                    r => new List<object>(){
                    new { 
                        remote= new { url = r.ValidationParameters["url"], fiesls=r.ValidationParameters["additionalfields"]},
                    }
                });

        }
    }
}

