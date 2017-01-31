<?php
/**
 * Created by PhpStorm.
 * User: hung
 * Date: 31/01/17
 * Time: 23:52
 */

namespace App\Repositories;


abstract class BaseRepository
{
    /**
     * Get all model
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAll()
    {
        return $this->model->all();
    }

    /**
     * Get a specify model
     * @param  int $id model ID
     * @return model
     */
    public function getById($id)
    {
        return $this->model->findOrFail($id);
    }

    /**
     * Get item of model
     * @param  int $id Model ID
     * @return Model
     */
    public function find($id)
    {
        return $this->model->find($id);
    }

    /**
     * Get items with filter & paginate
     * @param  array  $filter
     * @param  integer $pageSize
     * @return Illuminate\Support\Collection Model collections
     */
    public function getAllWithPaginate($filter = [], $pageSize = 20)
    {
        if ( ! empty($filter))
        {
            foreach ($filter as $key => $value)
            {
                if ($value == '')
                {
                    unset($filter[$key]);
                }
            }
            return $this->model->where($filter)->paginate($pageSize);
        }
        return $this->model->paginate($pageSize);
    }

    /**
     * Create a model
     * @param  array $attributes
     * @return new Model
     */
    public function store($attributes)
    {
        return $this->model->create($attributes);

    }

    /**
     * Update a model
     * @param  int $id Model ID
     * @param  array $data
     * @return Model
     */
    public function update($id, $data)
    {
        $model = $this->getById($id);
        $model->fill($data)->save();
        return $model;
    }

    /**
     * Delete a model
     *
     * @param int|array int $id model ID
     * @return bool
     */
    public function delete($id)
    {
        $model  = $this->getById($id);
        $delete = is_array($id) ? $model->destroy($id) : $model->delete();
        return $delete;
    }


    public function getPluck($value, $key)
    {
        return $this->model->pluck($value, $key);
    }

    public function getInstance()
    {
        return new $this->model;
    }
}