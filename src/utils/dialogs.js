//@ZhangZiSu.cn
import Swal from 'sweetalert2'

export default {
    toasts: {
        error: async(msg) => {
            //console.log(`%c${new Date()}\n${msg}`, 'color: #ecf0f1; background: #e74c3c')
            return Swal.fire({
                title: '错误',
                text: msg || '未知错误',
                type: 'error',
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000
            })
        },
        success: async(msg) => {
            //console.log(`%c${new Date()}\n${msg}`, 'color: #ecf0f1; background: #2ecc71')
            return Swal.fire({
                title: '成功',
                text: msg || '操作完成',
                type: 'success',
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000
            })
        }
    },
    confirm: async(msg) => {
        //console.log(`%c${new Date()}\n${msg}`, 'color: #f1c40f')
        return (await Swal.fire({
            title: '三思而后行',
            text: msg || '确定操作？',
            type: 'warning'
        })).value
    }
}