var Solution = function(v) { // �ѵ�������Ҫ� (���O)
  this.v = v;                // �Ѽ� v ���ѵ�����Ƶ��c
}

Solution.prototype.step = 0.01;          // �C�@�p�B�w�]�����Z��

Solution.prototype.height = function() { // ���s�t��k�����ר��
  return -1*this.energy();               // ���� = -1 * ��q
}

module.exports = Solution;   // �N�ѵ����O�ץX�C