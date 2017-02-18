@extends('admin::layouts.master')
@section('content')
    {!! bread_crumb([
            'admincpp.getListCategory'=> trans('admin::category.list.title'),
            trans('admin::category.edit.title')
        ])
    !!}
    <div class="row">
        <div class="col-md-12">
            <div class="white-box">
                {!! box_title(trans('admin::category.add.title')) !!}
                @include(ADMIN_VIEW. 'categories.form', ['routeName'=> 'admincpp.postEditCategory', 'routeParam'=>'']);
            </div>
        </div>
    </div>
@stop