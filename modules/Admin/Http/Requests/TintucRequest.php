<?php

namespace Modules\Admin\Http\Requests;

use App\Http\Requests\FilterForm;

class TintucRequest extends FilterForm
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'new_cate_id'          => 'required',
            'new_title'            => 'required|unique:tintucs,new_title,'.$this->id.',new_id',
            'new_ingredient'       => 'required',
            'nec_seo_title'        => 'required',
            'nec_seo_keyword'      => 'required',
            'nec_seo_description'  => 'required',
            'new_description'      => 'required',
        ];
    }


    public function messages()
    {
         return [
                'new_cate_id.required'         => 'Vui lòng chọn ít nhất một danh mục phân loại ',
                'new_title.required'           => trans('admin::form.messages.required'),
                'new_ingredient.required'      => trans('admin::form.messages.required'),
                'nec_seo_title.required'       => trans('admin::form.messages.required'),
                'nec_seo_keyword.required'     => trans('admin::form.messages.required'),
                'nec_seo_description.required' => trans('admin::form.messages.required'),
                'new_description.required'     => trans('admin::form.messages.required'),
         ];
    }

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }
}