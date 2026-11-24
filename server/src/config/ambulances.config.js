const ambulances = new Map();

export function setAmbulance(id, data){
    ambulances.set(id, data);
}

export function getAmbulance(id){
    return ambulances.get(id);
}

export function getAmbulances(){
    return ambulances;
}

export function deleteAmbulance(id){
    ambulances.delete(id)
}


