var canOnlylogin = once(function(){
	       $.notify("Warning: Sesi berakhir, silahkan login kembali", "warn");
      function setTimes(){
        location.href = "/dasboard"
      }
  setTimeout(setTimes, 2000)
});

async function logJSONData() {
  // cpu system

  plat = document.getElementById("platform");
  ss = document.getElementById("statscpu");
  ps = document.getElementById("progresscpu");
  mn = document.getElementById("manufactur");
  os = document.getElementById("os");
  try {
    const response = await fetch("/stats");
    const cpus = await response.json();
    if(cpus.result.cpuLoad>60){
      ss.style.color = "red"
      ps.style.color = "red"
    } else {
      ss.style.color = null
      ps.style.color = null
    }
    ss.innerText = cpus.result.cpuLoad+"%"
    localStorage.setItem("yourlogin", 1)
    ps.style.width= cpus.result.cpuLoad+"%"
    plat.innerText= cpus.result.platform + " - "+cpus.result.logofile
    mn.innerText = cpus.result.manufacter
    os.innerText = cpus.result.versi

      if(cpus.trigger==1){
        
       
        canOnlylogin()
    }
  }catch(error){
    
  }
}
setInterval(logJSONData, 3000)

function once(fn, context) { 
	var result;

	return function() { 
		if(fn) {
			result = fn.apply(context || this, arguments);
			fn = null;
		}

		return result;
	};
}

