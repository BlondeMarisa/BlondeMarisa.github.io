// �����ǰҳ�����۾�ִ�к���
if (document.getElementById('post-comment')) owoBig();
// ����Ŵ�
function owoBig() {
    let flag = 1, // ���ý�����
        owo_time = '', // ���ü�ʱ��
        m = 3; // ���÷Ŵ���
    // ��������
    let div = document.createElement('div'),
        body = document.querySelector('body');
    // ����ID
    div.id = 'owo-big';
    // �������
    body.appendChild(div)

    // ����observer
    let observer = new MutationObserver(mutations => {

        for (let i = 0; i < mutations.length; i++) {
            let dom = mutations[i].addedNodes,
                owo_body = '';
            if (dom.length == 2 && dom[1].className == 'OwO-body') owo_body = dom[1];
            // �����Ҫ���������������ô˹������������ע��
            // else if (dom.length == 1 && dom[0].className == 'tk-comment') owo_body = dom[0];
            else continue;
            
            // �����Ҽ����ֻ��˳���������Ҽ��˵���Ϊ����������õ���
            if (document.body.clientWidth <= 768) owo_body.addEventListener('contextmenu', e => e.preventDefault());
            // �������
            owo_body.onmouseover = (e) => {
                    if (flag && e.target.tagName == 'IMG') {
                        flag = 0;
                        // ����300�������ʾ����
                        owo_time = setTimeout(() => {
                            let height = e.path[0].clientHeight * m, // ���Ӹ�
                                width = e.path[0].clientWidth * m, // ���ӿ�
                                left = (e.x - e.offsetX) - (width - e.path[0].clientWidth) / 2, // ��������Ļ��߾���
                                top = e.y - e.offsetY; // ��������Ļ��������

                            if ((left + width) > body.clientWidth) left -= ((left + width) - body.clientWidth + 10); // �ұ�Ե��⣬��ֹ������Ļ
                            if (left < 0) left = 10; // ���Ե��⣬��ֹ������Ļ
                            // ���ú�����ʽ
                            div.style.cssText = `display:flex; height:${height}px; width:${width}px; left:${left}px; top:${top}px;`;
                            // �ں����в���ͼƬ
                            div.innerHTML = `<img src="${e.target.src}">`
                        }, 300);
                    }
                };
            // ����Ƴ����غ���
            owo_body.onmouseout = () => { div.style.display = 'none', flag = 1, clearTimeout(owo_time); }
        }

    })
    observer.observe(document.getElementById('post-comment'), { subtree: true, childList: true }) // ������ Ԫ�� �� ������
}