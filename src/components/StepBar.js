import React from 'react';
import classnames from 'classnames';
import styles from './StepBar.less';

const StepBar = (props) => {
  const step2Cls = classnames({
    [styles.step2]: props.current !== '2',
    [styles.step2_checked]: props.current === '2' || props.current === '3',
  });
  const step2TitleCls = classnames({
    [styles.step2_title]: props.current !== '2',
    [styles.step2_checked_title]: props.current === '2' || props.current === '3',
  });
  const step3Cls = classnames({
    [styles.step3]: props.current !== '3',
    [styles.step3_checked]: props.current === '3',
  });
  const step3TitleCls = classnames({
    [styles.step3_title]: props.current !== '3',
    [styles.step3_checked_title]: props.current === '3',
  });
  return (
    <div className={styles.step_container}>
      <div className={`container ${styles.step}`}>
        <div className={styles.step_item}>
          <div className={styles.step1_checked} />
          <div className={styles.step1_checked_title} >{props.nameStep1}</div>
        </div>
        <div className={styles.arrow} />
        <div className={styles.step_item}>
          <div className={step2Cls} />
          <div className={step2TitleCls} >{props.nameStep2}</div>
        </div>
        <div className={styles.arrow} />
        <div className={styles.step_item}>
          <div className={step3Cls} />
          <div className={step3TitleCls} >{props.nameStep3}</div>
        </div>
      </div>
    </div>
  );
};

StepBar.propTypes = {
  current: React.PropTypes.string.isRequired,
  nameStep1: React.PropTypes.string.isRequired,
  nameStep2: React.PropTypes.string.isRequired,
  nameStep3: React.PropTypes.string.isRequired,
};

export default StepBar;
