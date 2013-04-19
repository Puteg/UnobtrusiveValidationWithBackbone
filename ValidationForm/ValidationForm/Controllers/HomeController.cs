using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ValidationForm.Models;

namespace ValidationForm.Controllers
{
    public class HomeController : Controller
    {

        public ActionResult Edit()
        {
            return View(VMData.Create());
        }

        [HttpPut]
        public ActionResult Edit(Data d)
        {
            return Json(d);
        }

        [HttpPost]
        [ActionName("Edit")]
        public ActionResult Create()
        {
            try
            {
                var data = new Data();
                var b = TryUpdateModel(data);
                data.Id = 68;
                return Json(data);
            }
            catch (Exception e)
            {
                throw new HttpException(e.Message);
            }
        }

        public ActionResult Remote(int stateId)
        {
            //System.Threading.Thread.Sleep(2000);  // имитация сетевой задержки

            var vm = VMData.Create();
            int validValue = 3; // код ЧП
            if (stateId != validValue) // только не ЧП
                return Json(new { status = "success" }, JsonRequestBehavior.AllowGet);
            else
                throw new HttpException(string.Format("remote validation -> не возможно {0}", vm.ListState.First(s => s.Value == validValue.ToString()).Text));
        }

    }
}


//if (data != null && data.StateId != validValue) //не возможно ЧП
