type NodeExecutionTimeProps = {
  showStats: boolean;
  data: any;
};

const NodeExecutionTime = (props: NodeExecutionTimeProps) => {
  let executionTime = props.data.output;

  // Round to 2 decimal places
  executionTime = Math.round(executionTime);

  return (
    <div className={`text-center ${props.showStats ? "" : "invisible"}`}>
      {executionTime ? `${executionTime}ms` : ""}
    </div>
  );
};

export default NodeExecutionTime;
