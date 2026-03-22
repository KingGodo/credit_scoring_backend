const { v4: uuidv4 } = require('uuid');
const {
  createModelVersion, getAllModelVersions, getModelVersionById,
  getModelVersionsByName, checkDuplicate,
  updateModelVersion, deleteModelVersion,
} = require('./model-versions.repository');

const create = async ({ model_name, model_version, training_dataset }) => {
  // Prevent duplicate model_name + model_version combination
  const duplicate = await checkDuplicate(model_name, model_version);
  if (duplicate) {
    throw {
      statusCode: 409,
      message: `Model "${model_name} ${model_version}" already exists.`,
    };
  }

  const model_id = uuidv4();
  return createModelVersion({ model_id, model_name, model_version, training_dataset });
};

const fetchAll = async () => getAllModelVersions();

const fetchById = async (model_id) => {
  const model = await getModelVersionById(model_id);
  if (!model) throw { statusCode: 404, message: 'Model version not found.' };
  return model;
};

const fetchByName = async (model_name) => getModelVersionsByName(model_name);

const update = async (model_id, data) => {
  const existing = await getModelVersionById(model_id);
  if (!existing) throw { statusCode: 404, message: 'Model version not found.' };

  // Check duplicate only if name or version is being changed
  const nameChanged = data.model_name && data.model_name !== existing.model_name;
  const versionChanged = data.model_version && data.model_version !== existing.model_version;

  if (nameChanged || versionChanged) {
    const duplicate = await checkDuplicate(
      data.model_name || existing.model_name,
      data.model_version || existing.model_version
    );
    if (duplicate) {
      throw {
        statusCode: 409,
        message: `Model "${data.model_name} ${data.model_version}" already exists.`,
      };
    }
  }

  return updateModelVersion(model_id, {
    model_name: data.model_name || existing.model_name,
    model_version: data.model_version || existing.model_version,
    training_dataset: data.training_dataset || existing.training_dataset,
  });
};

const remove = async (model_id) => {
  const existing = await getModelVersionById(model_id);
  if (!existing) throw { statusCode: 404, message: 'Model version not found.' };
  await deleteModelVersion(model_id);
};

module.exports = { create, fetchAll, fetchById, fetchByName, update, remove };