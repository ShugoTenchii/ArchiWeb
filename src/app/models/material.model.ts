export class Material {
    _id: string;
    name: string;
    type: string;
    status: string;
    assigned_to: string;
    room: string;
  
    constructor(_id: string, name: string, type: string, status: string, assigned_to: string, room: string) {
      this._id = _id;
      this.name = name;
      this.type = type;
      this.status = status;
      this.assigned_to = assigned_to;
      this.room = room;
    }
  }