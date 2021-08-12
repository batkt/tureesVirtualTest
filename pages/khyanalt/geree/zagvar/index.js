import React, { useMemo } from 'react'
import Admin from 'components/Admin'
import SunEditor, { buttonList } from 'suneditor-react'
import 'suneditor/dist/css/suneditor.min.css';
import { Button, Table, Form, Input, Select } from 'antd';
import { SolutionOutlined } from '@ant-design/icons';

const { Option } = Select

const columns = [
    {
        title: "Бүртгэсэн",
        dataIndex: "burtgesenAjiltaniiNer",
        ellipsis: true,
        render: () => {
            return "Админ"
        }
    }
]

const talbaruud = [{ ner: 'Овог', talbar: 'ovog' }, { ner: 'Нэр', talbar: 'ner' }]

var customPlugin = {
    // @Required @Unique
    name: 'custom_example',
    // @Required
    display: ('container' || 'command' || 'submenu' || 'dialog'),

    // @options
    // * You can also set from the button list
    // HTML title attribute (tooltip) - default: plugin's name
    title: 'Талбарийн нэр',
    // HTML to be append to button (icon)
    // Recommend using the inline svg icon. - default: "<span class="se-icon-text">!</span>"

    innerHTML: '<span style="padding:5px;">Т</span>',
    // The class of the button. - default: "se-btn"
    // "se-code-view-enabled": It is not disable when on code view mode.
    // "se-resizing-enabled": It is not disable when on using resizing module.
    buttonClass: '',

    // @Required
    add: function (core, targetElement) {
        console.log('est')
        // Generate submenu HTML
        // Always bind "core" when calling a plugin function
        let listDiv = this.setSubmenu.call(core);

        // You must bind "core" object when registering an event.
        /** add event listeners */
        var self = this;
        listDiv.querySelectorAll('.se-btn-list').forEach(function (btn) {
            btn.addEventListener('click', self.onClick.bind(core));
        });

        // @Required
        // You must add the "submenu" element using the "core.initMenuTarget" method.
        /** append target button menu */
        core.initMenuTarget(this.name, targetElement, listDiv);
    },

    setSubmenu: function () {
        const listDiv = this.util.createElement('DIV');
        // @Required
        // A "se-submenu" class is required for the top level element.
        listDiv.className = 'se-submenu se-list-layer';
        listDiv.innerHTML =
            '<div class="se-list-inner se-list-font-size"><ul class="se-list-basic">' +
            talbaruud.map(a => `<li><button type="button" class="se-btn-list" value="&lt;${a.talbar}&gt;">{${a.ner}}</button></li>`) +
            '</ul></div>'

        return listDiv;
    },
    onClick: function (e) {
        const value = e.target.value;
        const node = this.util.createElement('span');
        this.util.addClass(node, 'se-custom-tag');
        node.textContent = value;

        this.insertNode(node);
        const zeroWidthSpace = this.util.createTextNode(this.util.zeroWidthSpace);
        node.parentNode.insertBefore(zeroWidthSpace, node.nextSibling);

        this.submenuOff();
    }
}

function index() {
    const editorRef = React.useRef()
    const [sunValue, setValue] = React.useState('<p><span style="font-size: 16px;">1.1 Заалт&nbsp;&nbsp;<span class="se-custom-tag">&lt;ovog&gt; овогтой <span class="se-custom-tag">&lt;ner&gt; нь үүрэгтэй</span>​</span>​</span></p>')
    const data = { ner: 'Бат-Эрдэнэ', ovog: 'Цогтбаатар' }
    const onChange = (type, v) => {

    }

    const handleImageUpload = () => {

    }

    const value = React.useMemo(() => {
        var utga = sunValue
        talbaruud.map(a => utga = utga.replace(new RegExp(`&lt;${a.talbar}&gt;`, 'g'), data[a.talbar]))
        return utga
    }, [sunValue])

    return (
        <Admin khuudasniiNer='gereeniiZagvar' className='p-4'>
            <div className='bg-white rounded-md col-span-4 p-4'>
                <label>Гэрээний заалт</label>
                <Form>
                    <Form.Item label='1' name='1' >
                        <Input />
                    </Form.Item>
                    <Form.Item label='1' name='1'>
                        <Input />
                    </Form.Item>
                    <Form.Item label='1' name='1'>
                        <Input />
                    </Form.Item>
                    <Form.Item label='1' name='1'>
                        <Select />
                    </Form.Item>
                    <SunEditor
                        onChange={setValue}
                        defaultValue={value}
                        setOptions={{
                            plugins: [customPlugin],
                            height: 200,
                            buttonList: [...buttonList.complex, ['custom_example']]
                        }} showToolbar={true} ref={editorRef} onImageUpload={handleImageUpload} />
                    <div className='w-full mt-2'>
                        <Form.Item className='ml-auto'>
                            <Button type="primary" htmlType="submit" icon={<SolutionOutlined />} >
                                Хадгалах
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </div>
            <div className='bg-white rounded-md col-span-8 p-4'>
                <div className='w-full'>
                    <Button className='ml-auto'>Заалт нэмэх</Button>
                </div>
                <Table
                    className='mt-5'
                    bordered
                    scroll={{ y: "calc(100vh - 32rem)" }}
                    size="small"
                    rowKey={(row) => row._id}
                    columns={columns}
                />
            </div>
        </Admin>
    )
}

export default index
