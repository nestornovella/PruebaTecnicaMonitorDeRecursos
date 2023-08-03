

const tdpRuls = {
    intel:{
        i3:65,
        i5:95,
        i7:125,
        i9:250
    },
    amd:{
        zen3: 65,
        zen5: 95,
        zen7: 105,
        zen9: 180,
    },
    memory:{
        ddr4: 1.2
    }
    
}
function findCpuTDP(cpu){
    let result
    if(!cpu)return 100
    if(cpu.includes('i3')) result = tdpRuls.intel.i3
    else if(cpu.includes('i5')) result = tdpRuls.intel.i5
    else if(cpu.includes('i7')) result = tdpRuls.intel.i7
    else if(cpu.includes('i9')) result = tdpRuls.intel.i9
    else result = 100

    return result
   
}

function averageCpuVoltage(object){
    try {
        return +((object.cpu/100) * findCpuTDP(object.cpuModel)).toFixed(1)
    } catch (error) {
        console.log({error:error})
    }

   
}

function averageRamVoltage(object){
    try {
        return +(((object.totalRam * object.ramValue) / 100) * tdpRuls.memory.ddr4).toFixed(1)
    } catch (error) {
        console.log({error:error})
    }  
}

module.exports={
    averageCpuVoltage,
    averageRamVoltage
}