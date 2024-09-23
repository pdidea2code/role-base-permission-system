await Promise.all(
  permission.map(async (data) => {
    const rolehasepermission = await RolehasePermission.findOne({ role_id: role._id._bsontype, permission_id: data });
    if (rolehasepermission) {
      await RolehasePermission.deleteOne({ role_id: role._id._bsontype, permission_id: data });
    }
  })
);

await Promise.all(
  permission.map(async (data) => {
    const rolehasepermission = await RolehasePermission.create({
      role_id: role._id,
      permission_id: data,
    });
    
  })
);
