var hillClimbing = function() {} // ���s�t��k������Ҫ� (���O)

hillClimbing.prototype.run = function(s, maxGens, maxFails) { // ���s�t��k���D����
  console.log("s=%s", s); // �L�X��l��
  var fails = 0;          // ���Ѧ��Ƴ]�� 0
  // ��N�� gen<maxGen�A�B�s�򥢱Ѧ��� fails < maxFails �ɡA�N������մM���n���ѡC
  for (var gens=0; gens<maxGens && fails < maxFails; gens++) {
    var snew = s.neighbor();           // ���o�F�񪺸�
    var sheight = s.height();          // sheight=�ثe�Ѫ�����
    var nheight = snew.height();       // nheight=�F��Ѫ�����
    if (nheight >= sheight) {          // �p�G�F��Ѥ�ثe�ѧ�n
      s = snew;                        //   �N���ʹL�h
      console.log("%d: %s", gens, s);  //   �L�X�s����
      fails = 0;                       //   ���ʦ��\�A�N�s�򥢱Ѧ����k�s
    } else                             // �_�h
      fails++;                         //   �N�s�򥢱Ѧ��ƥ[�@
  }
  console.log("solution: %s", s);      // �L�X�̫��쪺���Ӹ�
  return s;                            //   �M��Ǧ^�C
}

module.exports = hillClimbing;         // �N���s�t��k�����O�ץX�C
