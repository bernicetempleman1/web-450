interface Garden {
  _id: string;
  gardenId: number;
  name: string;
  location: string;
  description?: string;
  dateCreated?: string;
  dateModified?: string;
  }

type UpdateGardenDTO = Omit<Garden, '_id' & 'gardenId' & 'dateCreated' & 'dateModified'>;
type AddGardenDTO = Omit<Garden, '_id' & 'dateModified'>;


export { Garden, AddGardenDTO, UpdateGardenDTO };


