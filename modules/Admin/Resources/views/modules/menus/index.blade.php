@extends('admin::layouts.master')
@section('content')
    {!! bread_crumb([
            'admincpp.getListMenu'=> trans('admin::menu.list.title')
        ])
    !!}
    <?php $dataGrid = new DataGrid(); $stt =0; ?>
    <div class="row">
        <div class="col-md-12">
            <div class="white-box">
                {!! box_title(trans('admin::menu.list.title'), false) !!}
                <div class="search-box">
                    <form action="{{ route('admincpp.getListMenu') }}" class="form-inline">
                        <label for="">
                            Tiêu đề
                            <input type="text" name="mnu_name" class="form-control input-sm" value="{{ get_value('mnu_name', 'str') }}">
                        </label>
                        <label for="">
                            Vị trí
                            <?php $getMenuPosition = get_value('mnu_position', 'int') ; ?>
                            <select name="mnu_position" id="mnu_position" class="form-control input-sm">
                                <option value="">Tìm vị trí</option>
                                @foreach($configPosition as $key => $value)
                                    <?php $selected = ($getMenuPosition == $key) ? 'selected=selected' : '' ;?>
                                    <option {{ $selected }} value="{{ $key }}">{{ $value }}</option>
                                @endforeach
                            </select>
                        </label>
                        <label>
                            <button type="submit" class="btn btn-info btn-sm"><i class="icon-magnifier"></i> Search</button>
                        </label>
                    </form>
                </div>
            </div>
            <div class="white-box padd-0">
                <form action="{{ route('admincpp.postProcessQuickMenu') }}" id="formTable">
                    <table  class="table table-bordered table-stripped" id="dataTableList">
                        <thead>
                            <tr bgcolor="#428BCA" style="color: #fff">
                                <td width="3%" align="center" class="bold">Stt</td>
                                <td width="4%" align="center" class="bold">
                                    {!! $dataGrid->makeCheckAllRadio() !!}
                                </td>
                                <td class="bold">Tiêu đề</td>
                                <td class="bold">Đi tới</td>
                                <td width="7%" align="center" class="bold">Vị trí</td>
                                <td width="5%" class="bold">Thứ tự</td>
                                <td width="7%" align="center" class="bold">Cửa sổ</td>
                                <td width="4%" align="center" class="bold">Status</td>
                                <td width="4%" align="center" class="bold">Copy</td>
                                <td width="4%" align="center" class="bold">Edit</td>
                                <td width="4%" align="center" class="bold">Delete</td>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($menus as $value)
                            <?php $stt ++; $menu_id = $value['mnu_id'];?>
                            <tr>
                                <td align="center">{{ $stt }}</td>
                                <td align="center">
                                    {!! $dataGrid->makeCheckRadio($menu_id) !!}
                                </td>
                                <td>
                                    <a href="javascript:void(0)">
                                    <?php if(isset($value['level'])) { for($j=0; $j< $value["level"];$j++) echo "--"; }?>
                                    <span
                                        data-name="editname"
                                        data-pk="{{ $menu_id }}"
                                        class="editMenuName">{{ $value['mnu_name'] }}</span>
                                    </a>
                                </td>
                                <td>{{ $value['mnu_link'] }}</td>
                                <td align="center">{{ $configPosition[$value['mnu_position']] }}</td>
                                <td align="center">
                                    <a href="javascript:void(0)">
                                    <span
                                        data-name="editorder"
                                        data-pk="{{ $menu_id }}"
                                        class="editMenuOrder">{{ $value['mnu_order'] }}
                                    </span>
                                    </a>
                                </td>
                                <td align="center">{{ $configTarget[$value['mnu_target']] }}</td>
                                <td align="center">
                                    <a href="javascript:void(0)">
                                        <span
                                            data-action="updateStatus"
                                            data-id="{{ $menu_id }}"
                                            data-check="{{ ($value['mnu_status'] == 1 ? 'checked' : '') }}"
                                            class="execute_form fa fa-2x {{ ($value['mnu_status'] == 1 ? 'fa-check-circle' : 'fa-circle') }}">
                                        </span>
                                    </a>
                                </td>
                                <td align="center">
                                    {!! $dataGrid->makeCopyButton(['admincpp.getEditMenu',$menu_id]) !!}
                                </td>
                                <td align="center">
                                    {!! $dataGrid->makeEditButton(['admincpp.getEditMenu',$menu_id]) !!}
                                </td>
                                <td align="center">
                                    {!! $dataGrid->makeDeleteButton(['admincpp.getDeleteMenu',$menu_id]) !!}
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="11" align="center">
                                    Not exist data
                                </td>
                            </tr>
                            @endforelse
                        </tbody>
                        <tfoot>

                        </tfoot>
                    </table>
                </form>
            </div>
        </div>
    </div
@stop
@section('js')
    <script>
        EditQuickXtable('/menu/process-quick-menu', '.editMenuName');
        EditQuickXtable('/menu/process-quick-menu', '.editMenuOrder');
    </script>
@stop
